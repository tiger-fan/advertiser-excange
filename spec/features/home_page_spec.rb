require "spec_helper"

describe "HomePage" do
  subject { page }
  
  before { visit spree_path }

  describe "header" do

    it { should have_selector('div#search input#address') }
    it { should have_selector('ul#nav-bar li a', text: 'Advertiser Sign in') }
    it { should have_selector('ul#nav-bar li a', text: 'Advertiser Sign up') }

    it "should have a breadcrumb" do
      subject.should have_selector('ul#bread-crumb.breadcrumb li a', text: 'Home')
    end

    it "should have menu bar with Price Size and Type dropdowns" do
      subject.should have_selector('li.dropdown a.dropdown-toggle', text: 'Price')
      subject.should have_selector('li.dropdown a.dropdown-toggle', text: 'Size')
      subject.should have_selector('li.dropdown a.dropdown-toggle', text: 'Type')
    end

    it "should have a menubar with List Photos and Map links" do
      subject.should have_selector('a[href="/"]', text: 'List')
      subject.should have_selector('a[href="/photos"]', text: 'Photos')
      subject.should have_selector('a[href="/map"]', text: 'Map')
    end
  end

  describe "products List" do
    context "when empty" do
      it "should display an empty products list" do
        subject.should have_text("No products found")
      end
    end

    context "with products aka ad spaces from retailers" do
      before do
        FactoryGirl.create_list(:product, 5)
        subject { page }
        visit spree_path
      end

      it "lays out first 3 products side by side" do
        subject.should have_selector('div#content>div>ul#products>li', count: 3)
      end

      it "lays out the others products vertically" do
        subject.should have_selector('div#product-detail-list>ul#products>li', count: 2)    
      end
    end

    context "with less than 3 products" do
      before do
        FactoryGirl.create_list(:product, 2)
        subject { page }
        visit spree_path
      end

      it "lays out first 2 products side by side" do
        subject.should have_selector('div#content>div>ul#products>li', count: 2)
      end

      it "does not lay out the others products vertically" do
        subject.should_not have_selector('div#product-detail-list>ul#products>li', count: 2)
      end
    end
  end

  describe "footer" do
    it { should have_selector('#footer') }
    it { should have_selector('#footer ul li', text: 'Connect With Us') }
    it { should have_selector('#footer ul li', text: 'Find Retailers') }
    it { should have_selector('#footer ul li', text: 'For Retailers') }
    it { should have_selector('#footer ul li', text: 'Corporate') }
  end
end