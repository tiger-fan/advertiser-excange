module ApplicationHelper
  def is_map_view
  	if controller.controller_name == 'home' and params[:action] == 'map'
  		return true
  	else
  		return false
  	end
  end

  def home_view
  	if controller.controller_name == 'home' || controller.controller_name == 'corperate'
  		return true
  	else
  		return false
  	end
  end

  def get_controller_name
    if controller.controller_name == 'home' || controller.controller_name == 'corperate'
      return ""
    else
      return controller.controller_name.titleize.gsub("Product", "Retailer")
    end
  end

  def get_params
    slash = request.path.rindex("/") + 1
    path = request.path.titleize[slash..-1].gsub("Product", "Retailer")
    
    if path == ""
      path = "List"
    end

    return path
  end

  def get_coordinate(properties)
    coord = Hash.new
    @product_properties.each do |p|
      if p.property.name =="longitude"
        coord[:longitude] = p.value
      elsif p.property.name =="latitude"
        coord[:latitude] = p.value
      end
    end
    return coord
  end

  def us_states
    [
      ['Alabama', 'AL'],
      ['Alaska', 'AK'],
      ['Arizona', 'AZ'],
      ['Arkansas', 'AR'],
      ['California', 'CA'],
      ['Colorado', 'CO'],
      ['Connecticut', 'CT'],
      ['Delaware', 'DE'],
      ['District of Columbia', 'DC'],
      ['Florida', 'FL'],
      ['Georgia', 'GA'],
      ['Hawaii', 'HI'],
      ['Idaho', 'ID'],
      ['Illinois', 'IL'],
      ['Indiana', 'IN'],
      ['Iowa', 'IA'],
      ['Kansas', 'KS'],
      ['Kentucky', 'KY'],
      ['Louisiana', 'LA'],
      ['Maine', 'ME'],
      ['Maryland', 'MD'],
      ['Massachusetts', 'MA'],
      ['Michigan', 'MI'],
      ['Minnesota', 'MN'],
      ['Mississippi', 'MS'],
      ['Missouri', 'MO'],
      ['Montana', 'MT'],
      ['Nebraska', 'NE'],
      ['Nevada', 'NV'],
      ['New Hampshire', 'NH'],
      ['New Jersey', 'NJ'],
      ['New Mexico', 'NM'],
      ['New York', 'NY'],
      ['North Carolina', 'NC'],
      ['North Dakota', 'ND'],
      ['Ohio', 'OH'],
      ['Oklahoma', 'OK'],
      ['Oregon', 'OR'],
      ['Pennsylvania', 'PA'],
      ['Puerto Rico', 'PR'],
      ['Rhode Island', 'RI'],
      ['South Carolina', 'SC'],
      ['South Dakota', 'SD'],
      ['Tennessee', 'TN'],
      ['Texas', 'TX'],
      ['Utah', 'UT'],
      ['Vermont', 'VT'],
      ['Virginia', 'VA'],
      ['Washington', 'WA'],
      ['West Virginia', 'WV'],
      ['Wisconsin', 'WI'],
      ['Wyoming', 'WY']
    ]
end
end