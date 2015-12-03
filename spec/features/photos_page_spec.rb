require "spec_helper"

describe "Photos Page" do
  subject { page }

  context "with no retailers" do
    before { visit photos_path }

    it "should display an empty products list" do
      subject.should have_text("No Retailers Found")
    end   
  end 

  context "with retailers" do
    before do
      FactoryGirl.create_list(:product, 43)
      visit photos_path
    end

    it "lays out first line with 3 photos side by side" do
      expect(all("ul#products")[0].all('li').size).to eq(3)
      expect(all('ul#products')[0].all('li a.info')[0]).not_to be_nil
      expect(all('ul#products')[0].all('li span.price.selling')[0]).not_to be_nil
    end

    it "lays out the subsequent lines with 5 small photos side by side" do
      expect(all("ul#products")[1].all('li').size).to eq(5)
      expect(all('ul#products')[1].all('li a.info')[0]).not_to be_nil
      expect(all('ul#products')[1].all('li span.price.selling')[0]).not_to be_nil
    end

    it "provides a pagination link" do
      pending()
      expect(subject).to have_selector('nav.pagination')
      expect(subject).to have_selector('nav.pagination span.next')
      expect(subject).to have_selector('nav.pagination span.page')
      expect(subject).to have_selector('nav.pagination span.last')
      expect(subject).to have_selector('nav.pagination span.current')
    end
  end
end