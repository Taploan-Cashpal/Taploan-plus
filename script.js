const backendUrl = 'https://<YOUR_GLITCH_PROJECT_NAME>.glitch.me'; // Replace with Glitch URL
const loanForm = document.getElementById("loanForm");

if (loanForm) {
    loanForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const amount = document.getElementById("amount").value;
        const duration = document.getElementById("duration").value;

        const res = await fetch(`${backendUrl}/loan`, {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({name,email,amount,duration})
        });
        const data = await res.json();
        alert(data.message);
        loanForm.reset();

        setTimeout(()=>checkApprovedLoan(email), 1000);
    });
}

async function checkApprovedLoan(email) {
    const res = await fetch(`${backendUrl}/loans`);
    const loans = await res.json();
    const myLoan = loans.find(l => l.email === email && l.status === 'Approved' && !l.depositPaid);

    if(myLoan){
        if(confirm(`Your loan is approved! Pay 10% deposit: Gh¢${myLoan.depositAmount}?`)){
            const payRes = await fetch(`${backendUrl}/pay-deposit`, {
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({loanId: myLoan.id, email})
            });
            const data = await payRes.json();

            if(data.authorization_url){
                window.open(data.authorization_url,'_blank');
            } else {
                alert('Payment initialization failed');
            }
        }
    }
}
