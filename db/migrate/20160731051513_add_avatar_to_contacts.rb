class AddAvatarToContacts < ActiveRecord::Migration
  def change
    change_table :contacts do |t|
      t.string :avatar
    end
  end
end
