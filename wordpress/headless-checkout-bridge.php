<?php
/**
 * Plugin Name: Headless Checkout Bridge
 * Description: Lets the Next.js storefront hand its cart to WooCommerce and land on the normal checkout page.
 *              Usage: /?aa_checkout=1&items=PRODUCT_ID:QTY:VARIATION_ID,PRODUCT_ID:QTY:VARIATION_ID
 * Version:     1.0.0
 *
 * Install: drop this file into wp-content/mu-plugins/ (create the folder if needed) or zip it as a normal plugin.
 * Caching: exclude requests containing the "aa_checkout" query string from page/CDN caching.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'template_redirect',
	function () {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( empty( $_GET['aa_checkout'] ) || ! function_exists( 'WC' ) ) {
			return;
		}

		if ( null === WC()->cart && function_exists( 'wc_load_cart' ) ) {
			wc_load_cart();
		}
		if ( null === WC()->cart ) {
			return;
		}

		WC()->cart->empty_cart();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$raw  = isset( $_GET['items'] ) ? sanitize_text_field( wp_unslash( $_GET['items'] ) ) : '';
		$rows = array_slice( array_filter( explode( ',', $raw ) ), 0, 50 );

		foreach ( $rows as $row ) {
			$parts        = array_map( 'absint', explode( ':', $row ) );
			$product_id   = $parts[0] ?? 0;
			$quantity     = max( 1, min( 99, $parts[1] ?? 1 ) );
			$variation_id = $parts[2] ?? 0;

			if ( ! $product_id ) {
				continue;
			}

			$product = wc_get_product( $variation_id ? $variation_id : $product_id );
			if ( ! $product || ! $product->is_purchasable() ) {
				continue;
			}

			$attributes = $variation_id ? $product->get_variation_attributes() : array();
			WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $attributes );
		}

		// Preserve any coupon passed along, e.g. &coupon=WELCOME10
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! empty( $_GET['coupon'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			WC()->cart->apply_coupon( sanitize_text_field( wp_unslash( $_GET['coupon'] ) ) );
		}

		wp_safe_redirect( wc_get_checkout_url() );
		exit;
	}
);
