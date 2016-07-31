class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :address
      t.timestamps
    end

    create_table :phone_numbers do |t|
      t.references :contact
      t.string :number
      t.string :description
    end
    
  end
end
