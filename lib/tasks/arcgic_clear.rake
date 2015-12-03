namespace :arcgis do
  desc 'Clear arcgis assets from `/public/assets/store`.'

  task clear: :environment do
    if File.exists?("#{Rails.root}/public/assets/store/arcgis.js")
      File.delete("#{Rails.root}/public/assets/store/arcgis.js")
    end
    
    if File.exists?("#{Rails.root}/public/assets/store/style.css")
      File.delete("#{Rails.root}/public/assets/store/style.css")
    end

    if File.directory?("#{Rails.root}/public/assets/store/extras")
      FileUtils.rm_rf("#{Rails.root}/public/assets/store/extras")
    end
  end
end
