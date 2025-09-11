# import Base
# import Flavor
# import Sucursal
# import Topping

class Order():
    def __init__ (self, id_oder, flavors, base, size, toppings, date, total, sucursal) -> None:
        self.id_oder = id_oder
        self.flavors = flavors
        self.base = base
        self.size = size
        self.toppings = toppings
        self.date = date
        self.total = total
        self.sucursal = sucursal
