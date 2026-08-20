const amountInput = document.getElementById('loanAmount');
const rateInput = document.getElementById('interestRate');
const calcBtn = document.getElementById('calcBtn');
const quoteBtn = document.getElementById('quoteBtn');
const durationBtns = document.querySelectorAll('.duration-btn');

let selectedMonths = null;

// Duration selection
durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        durationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMonths = parseInt(btn.dataset.months, 10);
        toggleCalcBtn();
    });
});

// Thousand separator while typing in amount field
amountInput.addEventListener('input', () => {
    const digits = amountInput.value.replace(/[^\d]/g, '');
    amountInput.value = digits ? Number(digits).toLocaleString('en-GB') : '';
    toggleCalcBtn();
});

rateInput.addEventListener('input', () => {
    rateInput.value = rateInput.value.replace(/[^\d.]/g, '');
    toggleCalcBtn();
});

function getAmount() {
    return parseFloat(amountInput.value.replace(/,/g, '')) || 0;
}

function getRate() {
    return parseFloat(rateInput.value) || 0;
}

function toggleCalcBtn() {
    const valid = getAmount() > 0 && getRate() > 0 && selectedMonths !== null;
    calcBtn.disabled = !valid;
}

calcBtn.addEventListener('click', calculate);

function calculate() {
    const amount = getAmount();
    const annualRate = getRate();
    const months = selectedMonths;

    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = monthlyRate === 0
        ? amount / months
        : amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const totalCost = monthlyPayment * months;
    const totalInterest = totalCost - amount;
    const monthlyInterest = totalInterest / months;

    setText('monthlyPayment', currency(monthlyPayment));
    setText('monthlyInterest', currency(monthlyInterest));
    setText('totalInterest', currency(totalInterest));
    setText('loanLength', months + ' months');
    setText('totalCost', currency(totalCost));

    quoteBtn.disabled = false;
}

function setText(id, value) {
    document.getElementById(id).textContent = value;
}

function currency(value) {
    return '£' + value.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Enter key triggers calculation
[amountInput, rateInput].forEach(input => {
    input.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !calcBtn.disabled) calculate();
    });
});
