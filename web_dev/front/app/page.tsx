'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


function Home() {

  return (
    <main >
      <div className="welcome-image">
      </div>
      <div >

      </div>

      <div id="about-us" className="aboutus">
        <h1>About Us</h1>
        <p className="about-us-text">
          Welcome to our online bookstore! This project is the brainchild of a group of dedicated Computer Engineering students who share a common passion for books and technology. Our mission is to create a user-friendly platform that makes discovering and purchasing books an enjoyable and seamless experience. We understand the importance of a good book and the role it plays in shaping minds. That&apos;s why we&apos;ve designed our bookstore to cater to all kinds of readers, offering a wide range of genres.
        </p>
      </div>

      <div id="contact-us" className="contactus">

        Contact us:
        <a href="mailto:BookStore@example.com">Abdelrahman.Khalil@gu.edu.eg</a>
      </div>

    </main>
  )

}


export default Home;