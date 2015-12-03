require "spec_helper"

describe "Advertiser sign in" do
  subject { page }

  describe "from homepage" do
    before do
      FactoryGirl.create(:user, email: "johndoe@example.com", password: "please", password_confirmation: "please")
      visit spree_path
    end

    describe "correctly" do
      it "works" do
        all("ul#nav-bar li a[href='/login']")[0].click()

        fill_in "spree_user_email", with: "johndoe@example.com"
        fill_in "spree_user_password", with: "please"

        click_on "Login"
      end
    end

    describe "badly" do
      it "fails" do
        all("ul#nav-bar li a[href='/login']")[0].click()
        fill_in "spree_user_email", with: "johndoe@example.com"
        fill_in "spree_user_password", with: "badpassword"

        click_on "Login"

        expect(page).to have_text("Invalid email or password.")
      end
    end
  end


end