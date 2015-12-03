require 'spec_helper'

describe Spree::Campaign do

  describe "#fetch_products" do

    context "all products are available" do
      before do
        basic_product_properties

        location_property = Spree::Property.where(name: "location").first
        space_type_property = Spree::Property.where(name: "Space Type").first
        5.times do |i|
          p = FactoryGirl.create(:product)
          p.product_properties << FactoryGirl.create(:product_property, value: "520#{i} Melrose Ave, Los Angeles, California", property: location_property)
          p.product_properties << FactoryGirl.create(:product_property, value: FeatureMacros::SPACE_TYPES.sample, property: space_type_property )
        end
      end

      it "fetches the products matching the given criterias" do
        campaign = Spree::Campaign.new(state: "California", ad_width:"18", ad_height: "22", budget: 10000.0, counter_top: false, retailers_count: 5)
        result = campaign.fetch_products
        expect(result).to be_kind_of(Hash)
        expect(result).to have_key(:products)
        expect(result).to have_key(:quantity)
        expect(result[:products].length).to eq(5)
      end      
    end
  end
  
end
