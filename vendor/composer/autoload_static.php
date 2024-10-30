<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit7b61738a6e38d95871994011b8253344
{
    public static $prefixLengthsPsr4 = array (
        'C' => 
        array (
            'CKLS\\' => 5,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'CKLS\\' => 
        array (
            0 => __DIR__ . '/../..' . '/classes',
            1 => __DIR__ . '/../..' . '/inc',
            2 => __DIR__ . '/../..' . '/admin',
        ),
    );

    public static $classMap = array (
        'CKLS\\CKLS_Ajax' => __DIR__ . '/../..' . '/classes/ajax.php',
        'CKLS\\CKLS_Analytics' => __DIR__ . '/../..' . '/classes/analytics.php',
        'CKLS\\CKLS_DBManager' => __DIR__ . '/../..' . '/classes/dbmanager.php',
        'CKLS\\CKLS_Engine' => __DIR__ . '/../..' . '/classes/init.php',
        'CKLS\\CKLS_Restbot' => __DIR__ . '/../..' . '/classes/restbot.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit7b61738a6e38d95871994011b8253344::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit7b61738a6e38d95871994011b8253344::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit7b61738a6e38d95871994011b8253344::$classMap;

        }, null, ClassLoader::class);
    }
}
