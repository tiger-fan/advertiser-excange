require 'spree/testing_support/factories'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


Spree::Core::Engine.load_seed if defined?(Spree::Core)
Spree::Auth::Engine.load_seed if defined?(Spree::Auth)

# Create product properties
property_arr = [["dimensions", "Dimensions"],["location", "Location"],["latitude", "Latitude"],["longitude", "longitude"], ["Space Type","Type"],["width","Width"],["height","Height"],["sp","sp"]]
property_arr.each do |subarray|
  FactoryGirl.create(:property, name: subarray[0], presentation: subarray[1]) unless Spree::Property.where(name: subarray[0]).any?
end

# Create product prototypes
prototypes_arr = %w( Window Counter Wall Door Lawn )
prototypes_arr.each do |prototype|
  FactoryGirl.create(:prototype, name: prototype) unless Spree::Prototype.where(name: prototype).any?
end

# Create some products
FactoryGirl.create_list(:product, 5)
