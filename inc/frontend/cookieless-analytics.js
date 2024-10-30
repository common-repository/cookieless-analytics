import Promise from "promise-polyfill";
import TimeMe from "timeme.js";
import getBrowserFingerprint from "get-browser-fingerprint";
import UAParser from "ua-parser-js";

let ckls_session_running = false;
let ckls_first_session = false;

function ckls_is_bot() {
  const botPattern =
    "(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
  let re = new RegExp(botPattern, "i");
  let userAgent = navigator.userAgent;

  return re.test(userAgent);
}

let ckls_request = (req) => {
  let glue = ckls.url.indexOf("?") !== -1 ? "&" : "?";
  let ckls_token =
    glue +
    "token=" +
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 7);

  return new Promise((resolve, reject) => {
    // if (window.navigator.sendBeacon) {
    // window.navigator.sendBeacon(ckls.beacon, JSON.stringify(req.data));
    // resolve('ok');
    // } else {

    req.url = ckls.url + "cookieless-analytics/track" + ckls_token;
    fetch(req.url, {
      keepalive: true,
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(req.data),
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));

    //}
  });
};

let ckls_get_timeonpage = () => {
  ///return new Promise((resolve) => {

  if (typeof TimeMe === "undefined") return 0;

  const currentpage_time = TimeMe.getTimeOnCurrentPageInMilliseconds();

  TimeMe.resetAllRecordedPageTimes();
  TimeMe.initialize({
    currentPageName: document.location.pathname,
    idleTimeoutInSeconds: 30,
  });

  return currentpage_time;

  ///});
};

let ckls_get_fingerprint = () => {
  ///return new Promise((resolve, reject) => {

  let parser = new UAParser();
  let UAParams = parser.getResult();

  const Fingerprint = getBrowserFingerprint({
    debug: false,
  });

  let browserFingerprint = Fingerprint + UAParams.browser.name; //for stronger fingerprint identity

  return browserFingerprint;

  ///});
};

async function ckls_new_session() {
  if (ckls_is_bot()) return;
  ///Todo: do not track
  if (ckls_session_running) return;

  ckls_session_running = true;

  let parser = new UAParser();
  let UAParams = parser.getResult();

  let data = {
    fingerprint: ckls_get_fingerprint(),
    page_url: location.href,
    time: Math.floor(Date.now() / 1000),
    page_id: ckls.page_id,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    time_on_page: ckls_get_timeonpage(),
    device_resolution: window.screen.width + "x" + window.screen.height,
    browser: UAParams.browser.name,
    browser_version: UAParams.browser.version,
    platform: UAParams.os.name,
    device: window.screen.width > 768 ? "desktop" : "mobile",
  };

  let req = {
    method: "POST",
    data: data,
  };

  ckls_request(req).catch((error) => {
    ckls_session_running = false;
  });

  ckls_first_session = true;
  ckls_session_running = false;
}

async function ckls_update_session() {
  if (ckls_is_bot()) return;

  //Todo: do not track
  if (!ckls_first_session) return;

  let data = {
    fingerprint: ckls_get_fingerprint(),
    page_url: location.href,
    time_on_page: ckls_get_timeonpage(),
  };

  if (data.time_on_page > 0) {
    await ckls_request({
      data: data,
    }).catch((error) => {});
  }
}

function ckls_analytics_start() {
  ckls_new_session();

  document.addEventListener("visibilitychange", function () {
    if (
      document.visibilityState === "hidden" ||
      document.visibilityState === "unloaded"
    ) {
      ckls_update_session();
    }
  });
}

ckls_analytics_start();
