# Homepage (Root path)
get '/' do
  @contacts = Contact.all
  erb :index
end

get '/api/contacts' do
  content_type :json
  @contacts = Contact.all
  @contacts.to_json
end

get '/api/contacts/:id' do
  content_type :json
  begin
    @contact = Contact.find params[:id]
    @contact.to_json include: :phone_numbers
  rescue ActiveRecord::RecordNotFound => e
    { "error": "Record not found" }.to_json
  end
end

post '/contacts' do
  @contact = Contact.new
  @contact.first_name = params[:first_name]
  @contact.last_name = params[:last_name]
  @contact.email = params[:email]
  @contact.address = params[:address]
  if @contact.save
    erb :_contact, layout: false, locals: { contact: @contact }
  end
end

delete '/contacts/:id' do
  content_type :json
  begin
    @contact = Contact.find params[:id]
    if @contact.destroy
      { "status": "success" }.to_json
    else
      { "status": "fail" }.to_json
    end
  rescue ActiveRecord::RecordNotFound => e
    { "status": "Record not found" }.to_json
  end
end