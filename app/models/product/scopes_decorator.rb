Spree::Product.class_eval do
  add_search_scope :with_property_value do |property, value|
    properties = Spree::Property.table_name
    conditions = case property
    when String   then ["#{properties}.name = ?", property]
    when Property then ["#{properties}.id = ?", property.id]
    else               ["#{properties}.id = ?", property.to_i]
    end
    conditions = ["#{ProductProperty.table_name}.value like %?% AND #{conditions[0]}", value, conditions[1]]

    joins(:properties).where(conditions)
  end

  add_search_scope :like_property_value do |property, value|
    properties = Spree::Property.table_name
    conditions = ["#{properties}.name = ?", property]
    conditions = ["#{Spree::ProductProperty.table_name}.value like '%#{value}%' AND #{conditions[0]}", conditions[1]]

    joins(:properties).where(conditions)
  end
end