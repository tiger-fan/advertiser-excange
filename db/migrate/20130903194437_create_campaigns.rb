class CreateCampaigns < ActiveRecord::Migration
  def change
    create_table :campaigns do |t|
      t.string :state
      t.integer :ad_width
      t.integer :ad_height
      t.boolean :counter_top
      t.integer :budget
      t.integer :retailers_count
      t.decimal :total_ad_sq_ft

      t.timestamps
    end
  end
end
