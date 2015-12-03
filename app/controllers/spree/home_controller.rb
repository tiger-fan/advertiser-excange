module Spree
  class HomeController < Spree::StoreController
    helper 'spree/products'
    respond_to :html

    def index
      cookies[:theme] = :list

      no_search = params[:min_price].nil? or params[:max_price].nil? or params[:min_width].nil? or params[:max_width].nil? or params[:min_height].nil? or params[:max_height].nil?
      if no_search
        @searcher = Spree::Config.searcher_class.new(params)
        @searcher.current_user = try_spree_current_user
        @searcher.current_currency = current_currency
        @products = @searcher.retrieve_products
      else
        @products = search_products(params)
        @query = params.nil? ? Array.new : params
        @breadcrumbs = set_breadcrumbs(params)
      end
    end
    
    def map
      cookies[:theme] = :map

      no_search = params[:min_price].nil? or params[:max_price].nil? or params[:min_width].nil? or params[:max_width].nil? or params[:min_height].nil? or params[:max_height].nil?
      if no_search
        @searcher = Spree::Config.searcher_class.new(params)
        @searcher.current_user = try_spree_current_user
        @searcher.current_currency = current_currency
        @products = @searcher.retrieve_products
      else
        @products = search_products(params)
        @query = params.nil? ? Array.new : params
        @breadcrumbs = set_breadcrumbs(params)
      end
    end
    
    def photos
      cookies[:theme] = :photos
      not_query = params[:min_price].nil? or params[:max_price].nil? or params[:min_width].nil? or params[:max_width].nil? or params[:min_height].nil? or params[:max_height].nil?
      if not_query
        @searcher = Spree::Config.searcher_class.new(params)
        @searcher.current_user = try_spree_current_user
        @searcher.current_currency = current_currency
        @products = @searcher.retrieve_products
      else
        @products = search_products(params)
        @query = params
        @breadcrumbs = set_breadcrumbs(params)
      end
    end

    private

    def search_products(params)
      max_value = 9999999
      min_value = 0
      min_price = params[:min_price].nil? || params[:min_price] == "" ? min_value : params[:min_price].to_i
      max_price = params[:max_price].nil? || params[:max_price] == "" ? max_value : params[:max_price].to_i

      min_width = params[:min_width] == nil || params[:min_width] == "" ? min_value : params[:min_width].to_i
      max_width = params[:max_width] == nil || params[:max_width] == "" ? max_value : params[:max_width].to_i
      min_height = params[:min_height] == nil || params[:min_height] == "" ? min_value : params[:min_height].to_i
      max_height = params[:max_height] == nil || params[:max_height] == "" ? max_value : params[:max_height].to_i
      products = Spree::Product.price_between(min_price, max_price).where(spree_variants: {width: min_width..max_width, height: min_height..max_height})
      unless params[:taxon_id].nil? || params[:taxon_id] == ""
        taxon = Taxon.find_by_id(params[:taxon_id])
        products = products.in_taxon(taxon)
      end

      begin
        if !params[:zipcode].nil? && params[:zipcode] != ""
          products = products.like_property_value(:location, params[:zipcode])
        elsif !params[:county].nil? && params[:county] != ""
          products = products.like_property_value(:location, params[:county])
        end
      rescue
        puts "No zipcode property"
      end

      products
    end

    def set_breadcrumbs(params)
      breadcrumbs = []
      unless params.nil?
        breadcrumbs.push params[:state] if params[:state].present? 
        breadcrumbs.push params[:city] if params[:city].present? 
        breadcrumbs.push params[:zipcode] if params[:zipcode].present?
      end
      return breadcrumbs
    end

  end
end