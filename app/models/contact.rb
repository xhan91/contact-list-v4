class Contact < ActiveRecord::Base
  has_many :phone_numbers

  def name
    "#{first_name} #{last_name}"
  end

end