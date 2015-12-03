namespace :arcgis do
  desc 'Create a folder for arcgis assets and copy over files.'

  task create: :environment do
    # Create a `public/assets/store/extras/` folder if it doesn't exist.
    FileUtils.mkdir_p("#{Rails.root}/public/assets/store/extras")

    # Copy arcgis files to where they belong.
    FileUtils.copy("#{Rails.root}/lib/assets/arcgis.js",
      "#{Rails.root}/public/assets/store")

    FileUtils.copy("#{Rails.root}/lib/assets/style.css",
      "#{Rails.root}/public/assets/store")

    FileUtils.copy("#{Rails.root}/lib/assets/ClusterLayer.js",
      "#{Rails.root}/public/assets/store/extras")
  end
end
