import { AddressInterface } from "../../Interfaces/IAddress";
import { CustomerInterface } from "../../Interfaces/ICustomer";
import { OrderInterface } from "../../Interfaces/IOrder";
import { OrderItemInterface } from "../../Interfaces/IOrderItem";
import { ProductInterFace } from "../../Interfaces/IProduct";
import { SignInInterface } from "../../Interfaces/ISignIn";
import { CartInterface } from "../../Interfaces/ICart";
import { PaymentInterface } from "../../Interfaces/IPayment";

export const apiUrl = "http://localhost:8000";

async function SignIn(data: SignInInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };
    
    let res = await fetch(`${apiUrl}/signin`, requestOptions).then((res) => {
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

// Image
async function GetImageByProductID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/product-images/${id}`, requestOptions).then(
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

async function CreateImage(formData: FormData) {
  const requestOptions = {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: formData,
  };

  let res = await fetch(`${apiUrl}/product-image/1`, requestOptions).then(
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

// Product
async function GetProduct() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/products`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function GetProductByID(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  let res = await fetch(`${apiUrl}/product/${id}`, requestOptions).then(
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

async function UpdateProduct(data: ProductInterFace) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/product`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
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

//CreatePayment
// async function CreatePayment(formData: FormData, data: PaymentInterface) {
//   const requestOptions = {
//     method: "POST",
//     // headers: { "Content-Type": "application/json" },
//     body: formData, data,
//   };

//   let res = await fetch(`${apiUrl}/payment`, requestOptions).then(
//     (res) => {
//       if (res.status == 201) {
//         return res.json();
//       } else {
//         return false;
//       }
//     }
//   );

//   return res;
// }

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
// async function CreatePayment(paymentData: PaymentInterface, file?: File): Promise<any> {
//   try {
//     // สร้าง FormData
//     const formData = new FormData();

//     // เพิ่มข้อมูล JSON ไปยัง FormData
//     for (const [key, value] of Object.entries(paymentData)) {
//       formData.append(key, String(value));
//     }

//     // เพิ่มไฟล์ไปยัง FormData ถ้ามี
//     if (file) {
//       formData.append("SlipPath", file);
//     }

//     // ส่ง request ไปยัง API
//     const response = await fetch("/payment", {
//       method: "POST",
//       body: formData
//     });

//     // ตรวจสอบสถานะของ response
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Unknown error");
//     }

//     // รับข้อมูลจาก response
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("Failed to create payment:", (error as Error).message);
//     throw error;
//   }
// }





export {

    SignIn,

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
    GetOrderItemByOrderID,

    // Image  ----------------------------
    GetImageByProductID,
    CreateImage,

    // Product  --------------------------
    GetProduct,
    GetProductByID,
    UpdateProduct,
};
