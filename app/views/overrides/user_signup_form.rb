Deface::Override.new(:virtual_path => "spree/user_registrations/new",
 :name => "extra_user_fields_signup_form",
 :insert_after => "signup_inside_form",
 :partial => "spree/shared/login_bar",
 :disabled => false)