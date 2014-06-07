2014-06-07

1. file modified:
   index.php
   header.php
   functions.php

2. content useful:

   delete from index.php

   <?php get_sidebar(); ?>

   delete from header.php

   <!--[if IE 7]>
   <html class="ie ie7" <?php language_attributes(); ?>>
   <![endif]-->
   <!--[if IE 8]>
   <html class="ie ie8" <?php language_attributes(); ?>>
   <![endif]-->
   <!--[if !(IE 7) | !(IE 8)  ]><!-->

   <?php language_attributes(); ?>
   <?php bloginfo( 'description' ); ?>
   <?php get_search_form(); ?>