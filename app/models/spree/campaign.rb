module Spree
  class Campaign 
    attr_accessor :ad_height, :ad_width, :budget, :counter_top, :state, :retailers_count, :total_ad_sq_ft

    def initialize(args={})
      @ad_width = args[:ad_width]
      @ad_height = args[:ad_height]
      @budget = args[:budget]
      @counter_top = args[:counter_top]
      @state = args[:state]
      @retailers_count = args[:retailers_count]
      @total_ad_sq_ft = args[:total_ad_sq_ft]
    end

    # Fetch the products based on the campaign criterias and return a hash to populate an order
    # * Multiple products at once
    # +:products => { product_id => variant_id, product_id => variant_id }, :quantity => quantity+    
    def fetch_products
      products = Spree::Product.like_property_value("location", @state).limit(@retailers_count)
      quantity = products.size
      hash = {products: {}, quantity: quantity}
      products_variant_ids = products.map { |p| {"#{p.id}" => p.master.id }}
      hash[:products] = products_variant_ids.inject { |memo, h| memo.merge(h) }
      return hash
    end

  end  
end