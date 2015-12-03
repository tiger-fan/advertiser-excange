module Spree
  BaseHelper.module_eval do

    def link_to_cart(text = nil)
      return "" if current_spree_page?(spree.cart_path)

      text = text ? h(text) : Spree.t('cart')
      css_class = nil

      if current_order.nil? or current_order.line_items.empty?
        text = "#{text}: (#{Spree.t('empty')})"
        css_class = 'empty'
      else
        text = "#{text}: <span class='amount'>#{current_order.display_total.to_html}</span>".html_safe
        css_class = 'full'
      end
      link_to text, spree.cart_path, :class => "cart-info #{css_class}"

    end

    def breadcrumbs(taxon, separator="&nbsp;&raquo;&nbsp;")
      # return "" if current_page?("/") || taxon.nil?
      # separator = raw(separator)
      # crumbs = [content_tag(:li, link_to(Spree.t(:home), spree.root_path) + separator)]
      # if taxon
      #   crumbs << content_tag(:li, link_to(Spree.t(:products), products_path) + separator)
      #   crumbs << taxon.ancestors.collect { |ancestor| content_tag(:li, link_to(ancestor.name , seo_url(ancestor)) + separator) } unless taxon.ancestors.empty?
      #   crumbs << content_tag(:li, content_tag(:span, link_to(taxon.name , seo_url(taxon))))
      # else
      #   crumbs << content_tag(:li, content_tag(:span, Spree.t(:products)))
      # end
      # crumb_list = content_tag(:ul, raw(crumbs.flatten.map{|li| li.mb_chars}.join), class: 'inline')
      # content_tag(:nav, crumb_list, id: 'breadcrumbs', class: 'sixteen columns')
    end

    def custom_breadcrumbs
      divider = '<span class="divider"> > </span>'.html_safe

      crumbs = [content_tag(:li, link_to( Spree.t(:home), "/" + cookies[:theme].to_s) + divider)]

      if !@breadcrumbs.nil?
        @breadcrumbs.each_with_index do |b, i|
          
          if i < @breadcrumbs.size - 1
            crumbs << content_tag(:li, link_to(b, '#', :class => "region-breadcrumb") + divider)
          else
            crumbs << content_tag(:li, b + " Retailers")
          end

        end
      elsif !@taxon.nil?
        crumbs << content_tag(:li, link_to("Retailers", products_path) + divider)
        crumbs << @taxon.ancestors.collect { |ancestor| content_tag(:li, link_to(ancestor.name , seo_url(ancestor)) + divider) } unless @taxon.ancestors.empty?
        crumbs << content_tag(:li, content_tag(:span, link_to(@taxon.name , seo_url(@taxon))))
      else
        if home_view
          crumbs << content_tag(:li, get_params)
        else
          crumbs << content_tag(:li, get_controller_name.html_safe)
          
          unless get_controller_name == get_params
            crumbs << content_tag(:li, divider + get_params)
          end
        end

      end

      content_tag(:ul, raw(crumbs.flatten.map{|li| li.mb_chars}.join), id: 'bread-crumbs', class: "inline")
    end
  end
end