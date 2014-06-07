<?php
/**
 * The Header template for our theme
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage simplest
 * @since simplest 0.1
 */
?><!DOCTYPE html>
<html>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<link href="<?php bloginfo('template_directory'); ?>/images/favicon.png" rel="shortcut icon">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title><?php wp_title( '-', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
<![endif]-->
<?php wp_head(); ?>
</head>

<body>
	<div id="page">
		<header id="masthead" class="site-header" role="banner">
			<a class="home-link" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="" rel="home">
				<h1 class="site-title"><?php bloginfo( 'name' ); ?></h1>
			</a>

			<div id="navbar" class="navbar">
				<nav id="site-navigation" class="navigation main-navigation" role="navigation">
					<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_class' => 'nav-menu' ) ); ?>
				</nav>
			</div>
		</header><!-- #masthead -->

		<div id="main" class="site-main">
