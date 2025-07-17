// This file contains the JavaScript code for the DNS checker functionality.

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dns-form');
    const resultContainer = document.getElementById('result');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const domain = document.getElementById('domain').value;
        checkDNS(domain);
    });

    function checkDNS(domain) {
        resultContainer.innerHTML = 'Checking DNS settings for ' + domain + '...';
        
        // Simulate an API call to check DNS settings
        setTimeout(() => {
            const dnsData = {
                nameservers: ['ns1.example.com', 'ns2.example.com'],
                ipAddress: '192.0.2.1',
                status: 'Success'
            };
            displayResults(dnsData);
        }, 2000);
    }

    function displayResults(data) {
        resultContainer.innerHTML = `
            <h3>DNS Check Results for ${data.domain}</h3>
            <p>Status: ${data.status}</p>
            <p>IP Address: ${data.ipAddress}</p>
            <p>Nameservers: ${data.nameservers.join(', ')}</p>
        `;
    }

    document.getElementById('checkButton').addEventListener('click', async () => {
        const domain = document.getElementById('domain').value.trim();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = 'Checking...';

        if (!domain) {
            resultsDiv.innerHTML = 'Please enter a domain name.';
            return;
        }

        try {
            // Fetch A records
            const aRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
            const aData = await aRes.json();

            // Fetch NS records
            const nsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`);
            const nsData = await nsRes.json();

            let html = `<h2>Results for ${domain}</h2>`;

            if (aData.Answer) {
                html += '<h3>A Records</h3><ul>';
                aData.Answer.forEach(ans => {
                    html += `<li>${ans.data}</li>`;
                });
                html += '</ul>';
            } else {
                html += '<p>No A records found.</p>';
            }

            if (nsData.Answer) {
                html += '<h3>Name Servers</h3><ul>';
                nsData.Answer.forEach(ans => {
                    html += `<li>${ans.data}</li>`;
                });
                html += '</ul>';
            } else {
                html += '<p>No NS records found.</p>';
            }

            resultsDiv.innerHTML = html;
        } catch (err) {
            resultsDiv.innerHTML = 'Error fetching DNS info.';
        }
    });
});