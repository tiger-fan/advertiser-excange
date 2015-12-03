module FeatureMacros
  SPACE_TYPES = ["Door", "Window", "Counter", "Wall", "Lawn"]
  def basic_product_properties
    FactoryGirl.create(:property, name: "Space Type", presentation: "Type")
    FactoryGirl.create(:property, name: "location", presentation: "Location")
    FactoryGirl.create(:property, name: "latitude", presentation: "Latitude")
    FactoryGirl.create(:property, name: "longitude", presentation: "Longitude")
    FactoryGirl.create(:property, name: "width", presentation: "Width")
    FactoryGirl.create(:property, name: "height", presentation: "Height")
  end
end

RSpec.configure do |config|
  config.include FeatureMacros
end