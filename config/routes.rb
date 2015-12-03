AdvertiserExchange::Application.routes.draw do

  get "campaigns/new", to: 'spree/campaigns#new'

  # This line mounts Spree's routes at the root of your application.
  # This means, any requests to URLs such as /products, will go to Spree::ProductsController.
  # If you would like to change where this engine is mounted, simply change the :at option to something different.
  #
  # We ask that you don't use the :as option here, as Spree relies on it being the default of "spree"
  mount Spree::Core::Engine, :at => '/'
  
  devise_scope :user do
    get '/login', :to => "devise/sessions#new"
    get '/signup', :to => "devise/registrations#new"
    delete '/logout', :to => "devise/sessions#destroy"
  end

  get '/list', :to => "spree/home#index"
  get '/map', :to => "spree/home#map"
  get '/photos', :to => "spree/home#photos"
  # get '/campaign', to: 'spree/home#campaign', as: "campaign"
  get '/terms-of-service', :to => "spree/corperate#terms_of_service"
  get '/privacy-policy', :to => "spree/corperate#privacy_policy"
  get '/contacts', :to => "spree/corperate#contacts"
end