import { AddressInterface } from "../../Interfaces/IAddress";
import { CustomerInterface } from "../../Interfaces/ICustomer";
import { OrderInterface } from "../../Interfaces/IOrder";
import { OrderItemInterface } from "../../Interfaces/IOrderItem";
import { SignInInterface } from "../../Interfaces/ISignIn";
import { CartInterface } from "../../Interfaces/ICart";
import { ProductInterface } from "../../Interfaces/IProduct";

export const apiUrl = "http://localhost:8000";

async function SignInForCustomer(data: SignInInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };
    
    let res = await fetch(`${apiUrl}/signin-customer`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });
    
    return res;
}

async function SignInForOwner(data: SignInInterface) {
  const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  };
  
  let res = await fetch(`${apiUrl}/signin-owner`, requestOptions).then((res) => {
      if (res.status == 200) {
          return res.json();
      } else {
          return false;
      }
  });
  
  return res;
}

// Gender
async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/genders`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// Address
async function GetAddresses() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/addresses`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function GetAddressByID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/address/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function GetAddressByCustomerID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/addresses/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function UpdateAddressByID(data: AddressInterface, id: Number | undefined) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/address/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// Brand
async function GetBrands() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/brands`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

// Category
async function GetCategories() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/categories`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

// Customer
async function GetCustomers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/customers`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });
  return res;
}

async function GetCustomerByID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/customer/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );
  return res;
}

async function UpdateCustomerByID(data: CustomerInterface, id: Number | undefined) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/customer/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// Order
async function GetOrders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/orders`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function GetOrderByID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/order/${id}`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function GetOrderByCustomerID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/orders/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function CreateOrder(data: OrderInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/order`, requestOptions).then((res) => {
    if (res.status == 201) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function UpdateOrder(data: OrderInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/order`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

// OrderItem
async function GetOrderItems() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/orderItems`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function GetOrderItemByID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/orderItem/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function CreateOrderItem(data: OrderItemInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/orderItem`, requestOptions).then((res) => {
    if (res.status == 201) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function UpdateOrderItem(data: OrderItemInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/orderItem`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

// Owner
async function GetOwners() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/owners`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });
  return res;
}

async function GetOwnerByID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/owner/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }
  );
  return res;
}

// Image
async function ListImages() {
  try {
      const response = await fetch(`${apiUrl}/images`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (response.ok) {
          return await response.json();
      } else {
          console.error("Failed to fetch images:", response.status, response.statusText);
          return false;
      }
  } catch (error) {
      console.error("Error fetching images:", error);
      return false;
  }
}


async function GetImageByProductID(id: Number | undefined) {
  const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  };

  let res = await fetch(`${apiUrl}/product-images/${id}`, requestOptions)
      .then((res) => {
          if (res.status == 200) {
              return res.json();
          } else {
              return false;
          }
      });

  return res;
}

async function CreateImage(formData: FormData,id: Number | undefined) {
  const requestOptions = {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: formData,
  };

  let res = await fetch(`${apiUrl}/product-image/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 201) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

const UpdateImage = async (formData: FormData, id: number) => {
  try {
    const response = await fetch(`${apiUrl}/product-image/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Or use response.json() if the error is in JSON format
      console.error('Error response from server:', errorText);
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return false;
  }
};

// Product
async function CreateProduct(data: ProductInterface) {
  const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/products`, requestOptions)
      .then((res) => {
          if (res.status == 201) {
              return res.json();
          } else {
              return false;
          }
      });

  return res;
}

async function ListProducts() {
  const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  };

  let res = await fetch(`${apiUrl}/products`, requestOptions)
      .then((res) => {
          if (res.status == 200) {
              return res.json();
          } else {
              return false;
          }
      });

  return res;
}

async function GetProductByID(productID: number): Promise<ProductInterface | false> {
  const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  };

  try {
      const response = await fetch(`${apiUrl}/products/${productID}`, requestOptions);
      
      if (response.status === 200) {
          const productData: ProductInterface = await response.json();
          return productData;
      } else {
          console.error(`Failed to fetch product. Status: ${response.status}`);
          return false;
      }
  } catch (error) {
      console.error('An error occurred while fetching the product:', error);
      return false;
  }
}

async function UpdateProduct(id: number, data: ProductInterface) {
  if (id === undefined) {
      throw new Error("Product ID is undefined");
  }

  const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/products/${id}`, requestOptions)
      .then((res) => {
          if (res.status === 200) {
              return res.json();
          } else {
              console.error("Failed to update product:", res.status, res.statusText);
              return false;
          }
      });

  console.log("Product update response:", res);
  return res;
}

async function DeleteProductByID(id: number) {
  if (!id) {
      console.error('Product ID is required to delete');
      return false;
  }

  const requestOptions = {
      method: "DELETE"
  };

  try {
      const res = await fetch(`${apiUrl}/products/${id}`, requestOptions);
      return res.status === 200;
  } catch (error) {
      console.error('Error occurred while deleting product:', error);
      return false;
  }
}

// Cart Thiradet
export async function GetCart(id: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/cart/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

export async function UpdateQuantity(p0: CartInterface[], id: number, newQuantity: number) {//id cart
  try {
    const response = await fetch(`${apiUrl}/updateCart/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update quantity for item with ID: ${id}`);
    }

    // หลังจากอัปเดตสำเร็จ ให้เรียก GetCart เพื่อดึงข้อมูลตะกร้าล่าสุด
    const updatedCart = await GetCart(1);
    if (updatedCart) {
      console.log(`Updated quantity for item with ID: ${id} to ${newQuantity}`);
      return updatedCart; // อัปเดตข้อมูลตะกร้า
    } else {
      console.error('Failed to update cart');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Update Quantity Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
  return false;
}


export async function DeleteCart(id: number | undefined) { // รับค่า id ที่จะลบcart
  if (!id) {
    console.error("Invalid ID");
    return false;
  }

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(`${apiUrl}/deleteCart/${id}`, requestOptions);
    if (res.status === 200) {
      return await res.json();
    } else {
      console.error(`Error: ${res.status} - ${res.statusText}`);
      return false;
    }
  } catch (error) {
    console.error("Network error:", error);
    return false;
  }
}


export async function GetAllProduct() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`http://localhost:8000/getAllProducts`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
  
}

export async function AddToCart(customerId: number, productId: number, quantity: number) {
  
  const apiUrl = "http://localhost:8000";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ProductID: productId, CustomerID: customerId, Quantity: quantity }),
  };

  try {
    const response = await fetch(`${apiUrl}/c/${customerId}`, requestOptions);
    if (response.status === 200 || response.status === 201) {
     
      return await response.json();
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error("Network error:", error);
    return false;
  }
}

export async function UpdateProductbyid(data: ProductInterface,p_id:number) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/product/${p_id}`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}
// หมดละของ cart

//Payment
//GetOrderItemByOrderID
async function GetOrderItemByOrderID(id: Number | undefined) {
  const requestOptions = {
    method: "GET"
  };

  let res = await fetch(`${apiUrl}/orderItems/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// GetAddressByOrderID
async function GetAddressByOrderID(id: number): Promise<any> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${apiUrl}/addresseOrder/${id}`, requestOptions);

    if (response.ok) {
      return await response.json();
    } else {
      // Handle HTTP errors (e.g., 404, 500)
      console.error(`Error: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Error fetching address:', error);
    return null;
  }
}

async function CreatePayment(formData: FormData) {
  const requestOptions = {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: formData
  };

  let res = await fetch(`${apiUrl}/payment`, requestOptions).then(
    (res) => {
      if (res.status == 201) {
        return res.json();
      } else {
        return false;
      }
    }
  );

  return res;
}

async function UpdateOrderAddressByOrderID(data: OrderInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address_id: data.AddressID }),  // ส่ง AddressID ใหม่จาก OrderInterface
  };

  // ส่ง PATCH request ไปยัง API เพื่ออัปเดต AddressID
  let res = await fetch(`${apiUrl}/order/${data.ID}/address`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}




export {

    SignInForCustomer,
    SignInForOwner,

    // Gender
    GetGenders,
    
    // Address  --------------------------
    GetAddresses,
    GetAddressByID,
    GetAddressByCustomerID,
    UpdateAddressByID,
    GetAddressByOrderID,

    // Brand  ----------------------------
    GetBrands,

    // Category --------------------------
    GetCategories,

    // Customer --------------------------
    GetCustomers,
    GetCustomerByID,
    UpdateCustomerByID,

    // Payment  --------------------------
    CreatePayment,
    UpdateOrderAddressByOrderID,
    GetOrderItemByOrderID,
    
    // Order  ----------------------------
    GetOrders,
    GetOrderByID,
    GetOrderByCustomerID,
    CreateOrder,
    UpdateOrder,

    // OrderItem  ------------------------
    GetOrderItems,
    GetOrderItemByID,
    CreateOrderItem,
    UpdateOrderItem,

    // Owner  ----------------------------
    GetOwners,
    GetOwnerByID,

    // Image  ----------------------------
    ListImages,
    GetImageByProductID,   
    CreateImage,
    UpdateImage,

    // Product  --------------------------
    CreateProduct,
    ListProducts,
    GetProductByID,
    UpdateProduct,
    DeleteProductByID,
};
