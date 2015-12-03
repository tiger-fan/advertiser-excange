module Spree
  OrdersController.class_eval do
  	# Adds a new item to the order (creating a new order if none already exists)
    def populate
      populator = Spree::OrderPopulator.new(current_order(true), current_currency)
      if populator.populate(params.slice(:products, :variants, :quantity))
        fire_event('spree.cart.add')
        fire_event('spree.order.contents_changed')

        session[:added_new_order] = true
        associate_user

        redirect_to "/#{cookies[:theme]}"
      else
        flash[:error] = populator.errors.full_messages.join(" ")
        redirect_to :back
      end
    end
	end
end