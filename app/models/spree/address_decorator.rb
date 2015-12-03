Spree::Address.class_eval do  
  has_one :line_item, :foreign_key => 'address_id', :class_name => 'Spree::Address'
  
  # Skip validation
  Spree::Address.reset_callbacks(:validate)
  
  # Add validation if no line items connected...
  # with_options :unless => :has_line_item? do
  #   validates :firstname, :lastname, :address1, :city, :zipcode, :country, :phone, :presence => true
  #   validate :state_validate
  # end
  
  def has_line_item?
    true
  end
end