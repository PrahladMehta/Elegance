<script >

import { reactive} from 'vue';
import { useRouter } from 'vue-router';


export default {
  setup(){
  const router=useRouter();
  const user=reactive({
   password:'',
   confirmpassword:'',
   newpassword:''
  
});

  const handleChange=(e)=>{   
        user[e.target.name]=e.target.value;
        console.log(user); 
  }

  const handleSubmit= async ()=>{
      if(user.password.length===0||user.email.length===0||user.newpassword===0){
            alert("Email is empty");
            return;
      }
      try{
        const response=await fetch("http://localhost:4000/api/v1/resetpassword",{
        method:"POST",
        body:JSON.stringify(user),
        headers: {
        'Content-Type': 'application/json' 
     },  
      });
      const data=await response.json();
      if(data.success){
            alert("password update");
            router.push('/login');
            return;
      }

      alert(data.message);

      }catch(e){
            console.log("ERROR")
            console.log(e);
      }
    
     

  }

return {user,handleChange,handleSubmit};

  }



};

      
</script> 

<template>

      <div class="container">

            <div class="image-container"></div>
    
     <form action="" @submit.prevent="handleSubmit">

        <h1>Reset password</h1>

        <div>
         <input type="email" placeholder="Email" name="email" @change="handleChange">
     </div>
    
     <div>
        <input type="password" placeholder="Password" name="password" @change="handleChange">
     </div>

    

       <div>
            <input type="password" placeholder="New Password" name="newpassword" @change="handleChange">
       </div>
  
    
    <button>Update</button>
    
       
    </form>
     </div>
    
    </template>

<style>





</style>