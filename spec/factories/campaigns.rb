# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :campaign do
    state "MyString"
    ad_width 1
    ad_height 1
    counter_top false
    budget 1
  end
end
