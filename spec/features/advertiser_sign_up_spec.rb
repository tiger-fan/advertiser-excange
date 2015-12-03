require "spec_helper"

describe "Advertiser sign up" do
  subject { page }

  describe "from homepage" do
    before { visit spree_path }

    describe "correctly" do
      it "works" do
        all("ul#nav-bar li a[href='/signup']")[0].click()

        fill_in "spree_user_first_name", with: "john"
        fill_in "spree_user_last_name", with: "doe"
        fill_in "spree_user_company", with: "MyCompany"
        fill_in "spree_user_email", with: "johndoe@example.com"
        fill_in "spree_user_password", with: "please"
        fill_in "spree_user_password_confirmation", with: "please"

        click_on "Create"

        expect(Spree::User.count).to eq(1)
        expect(Spree::User.first.first_name).to eq("john")
        expect(Spree::User.first.last_name).to eq("doe")
        expect(Spree::User.first.email).to eq("johndoe@example.com")
      end
    end

    describe "with bad email" do
      it "fails" do
        all("ul#nav-bar li a[href='/signup']")[0].click()

        fill_in "spree_user_first_name", with: "john"
        fill_in "spree_user_last_name", with: "doe"
        fill_in "spree_user_company", with: "MyCompany"
        fill_in "spree_user_email", with: "johndoe"
        fill_in "spree_user_password", with: "please"
        fill_in "spree_user_password_confirmation", with: "please"

        click_on "Create"

        expect(Spree::User.count).to eq(0)
      end
    end

    describe "with missing mandatory informations" do
      describe "without company" do
        it "fails" do
          all("ul#nav-bar li a[href='/signup']")[0].click()

          fill_in "spree_user_first_name", with: "john"
          fill_in "spree_user_last_name", with: "doe"
          fill_in "spree_user_email", with: "johndoe"
          fill_in "spree_user_password", with: "please"
          fill_in "spree_user_password_confirmation", with: "please"

          click_on "Create"

          expect(Spree::User.count).to eq(0)
        end
      end
      describe "without last name" do
        it "fails" do
          all("ul#nav-bar li a[href='/signup']")[0].click()

          fill_in "spree_user_first_name", with: "john"
          fill_in "spree_user_company", with: "MyCompany"
          fill_in "spree_user_email", with: "johndoe"
          fill_in "spree_user_password", with: "please"
          fill_in "spree_user_password_confirmation", with: "please"

          click_on "Create"

          expect(Spree::User.count).to eq(0)
        end
      end
      describe "without first name" do
        it "fails" do
          all("ul#nav-bar li a[href='/signup']")[0].click()
          fill_in "spree_user_last_name", with: "doe"
          fill_in "spree_user_company", with: "MyCompany"
          fill_in "spree_user_email", with: "johndoe"
          fill_in "spree_user_password", with: "please"
          fill_in "spree_user_password_confirmation", with: "please"

          click_on "Create"

          expect(Spree::User.count).to eq(0)
        end
      end
    end

    describe "with existing email address" do
      before { FactoryGirl.create(:user, email: "existing@example.com")}

      it "fails" do
        all("ul#nav-bar li a[href='/signup']")[0].click()

        fill_in "spree_user_first_name", with: "john"
        fill_in "spree_user_last_name", with: "doe"
        fill_in "spree_user_company", with: "MyCompany"
        fill_in "spree_user_email", with: "existing@example.com"
        fill_in "spree_user_password", with: "please"
        fill_in "spree_user_password_confirmation", with: "please"

        click_on "Create"

        expect(Spree::User.count).to eq(1)
        expect(page).to have_text("1 error prohibited this record from being saved: There were problems with the following fields: Email has already been taken")
      end
    end
  end


end