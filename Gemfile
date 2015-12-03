source 'https://rubygems.org'

gem 'rails', '3.2.14'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'


group :development do
	gem 'sqlite3'
  gem 'quiet_assets'
end

group :development, :test do
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  gem 'guard'
  gem 'guard-rspec'
  gem 'faker'
end

group :test do
  gem 'zeus'
  gem 'json_spec'
  gem 'capybara'
  gem 'webmock'
  gem 'launchy'
  gem 'selenium-webdriver'
  gem 'poltergeist'
  gem 'database_cleaner'
end

group :production do
	gem 'thin'
	gem 'pg'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.1'
  gem 'coffee-rails', '~> 3.2.1'
  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platforms => :ruby

  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'
gem "bootstrap-sass", ">= 2.3.0.0"
gem 'simple_form'
# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'debugger'

gem 'spree', '2.0.4'
gem 'spree_gateway', :git => 'https://github.com/spree/spree_gateway.git', :branch => '2-0-stable'
gem 'spree_auth_devise', :git => 'https://github.com/spree/spree_auth_devise.git', :branch => '2-0-stable'
