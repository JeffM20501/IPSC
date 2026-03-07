from ..models import *
from helper_routes import create_routes

# ------User-------
create_routes('/users', (User, 'User'))

#-------Orders-----
create_routes('/orders', (Order, 'Order'))


#------Products-------
create_routes('/products', (Product, 'Product'))

#------Sale------
create_routes('/sales', (Sale, 'Sale'))

#------Alert-----
create_routes('/alerts',(Alert,'Alert'))

#------Supplier-------
create_routes('/suppliers', (Supplier,'Supplier'))

