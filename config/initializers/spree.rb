# Configure Spree Preferences
#
# Note: Initializing preferences available within the Admin will overwrite any changes that were made through the user interface when you restart.
#       If you would like users to be able to update a setting with the Admin it should NOT be set here.
#
# In order to initialize a setting do:
# config.setting_name = 'new value'
Spree.config do |config|
  # Example:
  # Uncomment to override the default site name.
  config.site_name = "Skurun - Advertise Exange Site"
	config.allow_ssl_in_production = false
	config.products_per_page = 73
	config.use_s3 = true
  config.s3_bucket = 'advertiser_exchange'
  config.s3_access_key = "AKIAJQEBV4MQZJNCJVAA"
  config.s3_secret = "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"
  config.hide_cents = true
  config.allow_guest_checkout = false
  config.allow_backorder_shipping = false
end
Spree.user_class = "Spree::User"