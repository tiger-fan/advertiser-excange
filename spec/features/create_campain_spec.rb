require "spec_helper"

describe "Create Campaign" do
  subject { page }
  
  before do
    visit spree_path 
    click_link 'Campaign'
  end

  it "through a form with state, ad with and height, counter top option and budget inputs" do
    expect(subject).to have_selector("form#campaign")
    expect(subject).to have_selector("select[name='campaign[state]']")
    expect(subject).to have_selector("input#campaign_ad_width")
    expect(subject).to have_selector("input#campaign_ad_height")
    expect(subject).to have_selector("input#campaign_budget")
    expect(subject).to have_selector("input#campaign_counter_top")
    expect(subject).to have_selector("input#campaign_retailers_count")
    expect(subject).to have_selector("input#campaign_total_ad_sq_ft")
    expect(subject).to have_selector("input[name='commit']")
  end

  it "compute retailers number and total ad sq/ft based on user input", js:true, driver: :poltergeist do
    select "California", from: "campaign_state"
    fill_in "campaign_ad_width", with: "18"
    fill_in "campaign_ad_height", with: "22"
    fill_in "campaign_budget", with: "10000"

    # expect(target).to
  end

  context "when there are retailers in the choosen state" do
    before do
      basic_product_properties

      location_property = Spree::Property.where(name: "location").first
      space_type_property = Spree::Property.where(name: "Space Type").first
      5.times do |i|
        product = FactoryGirl.create(:product)
        product.product_properties << FactoryGirl.create(:product_property, value: "520#{i} Melrose Ave, Los Angeles, California", property: location_property)
        product.product_properties << FactoryGirl.create(:product_property, value: FeatureMacros::SPACE_TYPES.sample, property: space_type_property )
      end
    end

    it "creates an order with several products" do
      select "California", from: "campaign_state"
      fill_in "campaign_ad_width", with: "18"
      fill_in "campaign_ad_height", with: "22"
      fill_in "campaign_budget", with: "10000"
      find("input[type='submit']").click

      expect(Spree::Order.count).not_to eq(0)
      expect(Spree::Order.first.total).not_to eq(0.0)
    end
  end
end