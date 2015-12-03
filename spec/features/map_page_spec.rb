require "spec_helper"

describe "Map page" do
  subject { page }

  context "with no retailers" do
    before { visit map_path }

    it "displays a map owe to esri", js: true, driver: :poltergeist do
      pending("waiting for map to be displayed in firefox")
      expect(Spree::Product.count).to eq(0)
      expect(subject).to have_selector('div#map_container')
    end

    it "displays menus to narrow down retailers by demographic datas", js: true, driver: :poltergeist do
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-1-header-0')
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-2-header-0')
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-3-header-0')
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-4-header-0')
    end
  end

  context "with 5 retailers" do
    before do
     FactoryGirl.create_list(:product, 5)
     subject { page }
     visit map_path
   end

    it "displays a map with clusters", js: true, driver: :poltergeist do
      pending("waiting for map to be displayed firefox")
      expect(Spree::Product.count).to eq(5)
      expect(subject).to have_selector('#clusters_layer')
    end

    it "displays menus to narrow down retailers by demographic datas", js: true, driver: :poltergeist do
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-1-header-0')
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-2-header-0')
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-3-header-0')
      expect(subject).to have_selector('div#accordion>div.ui-accordion>h3#ui-accordion-4-header-0')
    end
  end

  describe "demographic selection" do
    context "search by " do
      
    end
  end
end