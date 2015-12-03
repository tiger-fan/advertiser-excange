module Spree
  class CampaignsController < Spree::StoreController
    helper 'spree/products'
    respond_to :html

    def new
      @campaign = Spree::Campaign.new({})
    end

    def create
      @campaign = Spree::Campaign.new(params[:campaign])
      # Search for the Product corresponding to the campaign
      products_hash = @campaign.fetch_products 
      # Populate the order with the products
      populator = Spree::OrderPopulator.new(current_order(true), current_currency)
      if populator.populate(products_hash)
        fire_event('spree.cart.add')
        fire_event('spree.order.contents_changed')
        cookies[:cart_add] = "true"
        redirect_to "/#{cookies[:theme]}"
      else
        flash[:error] = populator.errors.full_messages.join(" ")
        redirect_to :back
      end
    end
  end
end
