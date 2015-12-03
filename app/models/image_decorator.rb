Spree::Image.class_eval do
  attachment_definitions[:attachment][:styles] = {
    :mini => '95x95>', # thumbs under image
    :small => '250x250>', # images on category view
    :product => '360x360>', # full product image
    :large => '600x600>' # light box image
  }
end