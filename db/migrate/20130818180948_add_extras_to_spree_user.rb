class AddExtrasToSpreeUser < ActiveRecord::Migration
  def up
  	add_column :spree_users, :first_name, :string
   	add_column :spree_users, :last_name, :string
   	add_column :spree_users, :phone, :string
   	add_column :spree_users, :company, :string
  end

  def down
  	remove_column :spree_users, :first_name
   	remove_column :spree_users, :last_name
   	remove_column :spree_users, :phone
   	remove_column :spree_users, :company
  end
end
