class AddUsernameImageBioToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :username, :string
    add_column :users, :image, :string
    add_column :users, :bio, :text
  end
end
