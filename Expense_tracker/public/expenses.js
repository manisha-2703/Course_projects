

document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submitBtn');
  const expenseTable = document.getElementById('expenseTable');
  const editForm = document.getElementById('editExpenseForm');

  function displayExpenses(expenses) {
    // Clear existing table content
    expenseTable.innerHTML = '';

    if (!Array.isArray(expenses)) {
      console.error('Invalid expenses response:', expenses);
      return;
    }

    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headerNames = ['Expenses', 'Description', 'Category', 'Action'];

    headerNames.forEach(name => {
      const headerCell = document.createElement('th');
      headerCell.textContent = name;
      headerRow.appendChild(headerCell);
    });

    tableHeader.appendChild(headerRow);
    expenseTable.appendChild(tableHeader);

    // Create table body
    const tableBody = document.createElement('tbody');

    expenses.forEach((expense, index) => {
      const row = document.createElement('tr');

      // Populate table cells with expense details
      const expenseCell = document.createElement('td');
      expenseCell.textContent = `$${expense.expense}`;
      row.appendChild(expenseCell);

      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = expense.description;
      row.appendChild(descriptionCell);

      const categoryCell = document.createElement('td');
      categoryCell.textContent = expense.category;
      row.appendChild(categoryCell);

      // Create action cell with edit and delete buttons
      const actionCell = document.createElement('td');

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editExpense(expense));
      actionCell.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteExpense(expense.id));
      actionCell.appendChild(deleteButton);

      row.appendChild(actionCell);

      tableBody.appendChild(row);
    });

    expenseTable.appendChild(tableBody);
  }

  function handleFormSubmit() {
    event.preventDefault();


    const expense = document.getElementById('expense').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const newExpense = {
      expense: parseFloat(expense),
      description: description,
      category: category,
    };
    
    const token = localStorage.getItem('token');
    
    axios.post('http://localhost:3000/expenses', newExpense, { headers: { "Authorization": token } })
      .then(response => response.data)
      .then(data => {
        fetchExpenses();
      })
      .catch(error => console.error('Error adding expense:', error));
    }    
  function fetchExpenses() {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expenses', { headers: { "Authorization": token } })
      .then(response => {
        if (!response.data) {
          throw new Error('No data received from the server');
        }
        displayExpenses(response.data);
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
        // Handle the error or provide user feedback
      });
  }
  

  function deleteExpense(expenseId) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expenses/${expenseId}`,{ headers: {"Authorization" : token} })
      .then(response => response.data)
      .then(data => {
        fetchExpenses();
      })
      .catch(error => console.error('Error deleting expense:', error));
  }

  function editExpense(expense) {
    // Populate the edit form with expense details
    document.getElementById('editExpenseId').value = expense.id;
    document.getElementById('editExpense').value = expense.expense;
    document.getElementById('editDescription').value = expense.description;
    document.getElementById('editCategory').value = expense.category;

    // Show the edit form
    editForm.style.display = 'block';
  }

  // Add event listener for the "Update Expense" button in the edit form
  document.getElementById('updateBtn').addEventListener('click', function () {
    updateExpense();
  });

  // Add event listener for the "Cancel" button in the edit form
  document.getElementById('cancelBtn').addEventListener('click', function () {
    // Hide the edit form
    editForm.style.display = 'none';
  });

  // Function to send a request to update the expense
  function updateExpense() {
    const id = document.getElementById('editExpenseId').value;
    const expense = document.getElementById('editExpense').value;
    const description = document.getElementById('editDescription').value;
    const category = document.getElementById('editCategory').value;

    const updatedExpense = {
      expense: parseFloat(expense),
      description: description,
      category: category,
    };

    axios.put(`http://localhost:3000/expenses/${id}`, updatedExpense)
      .then(response => response.data)
      .then(data => {
        // Hide the edit form
        editForm.style.display = 'none';

        // Fetch updated expenses
        fetchExpenses();
      })
      .catch(error => console.error('Error updating expense:', error));
  }
  submitButton.addEventListener('click', handleFormSubmit);

  // Fetch initial expenses on page load
  fetchExpenses();
  document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}
});
