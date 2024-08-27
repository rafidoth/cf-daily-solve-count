async function get_submissions() {
    const handle = document.getElementById('userHandle').value.trim();
    if (!userHandle) {
        alert('Please enter a Codeforces handle.');
        return;
    }
    const accepted_submissions = [];
    try {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const data = await response.json();
        if(data.status == "OK"){
            const submissions = data.result;
            submissions.forEach(submission => {
                if (submission.verdict === 'OK') {
                    const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
                    const problem = submission.problem;
                    const lang = submission.programmingLanguage;
                    const problem_object = {
                        problem : problem,
                        lang : lang
                    }
                    const ac = accepted_submissions.find(item => item.date === date);
                    if(ac){
                        ac.problems.push(problem_object);
                    }else{
                        accepted_submissions.push({
                            date : date,
                            problems : [problem_object],
                        })
                    }
                }
            });
        }else{
            alert('Failed to fetch data from Codeforces API.');
        }
        display(accepted_submissions);
        console.log("done");
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data. Please try again.');
    }
}


function display(submissions){
    submissions.forEach(submission=>{
        const container = document.getElementById('results');  
        const row = document.createElement('div');
        row.className = "cursor-pointer hover:bg-slate-900 justify-center rounded  py-2 px-4"


        const div = document.createElement('div');
        div.className= "flex gap-4"

        const date = submission.date;
        const p = document.createElement('p');
        p.textContent = `${date}`;
        
        const countSpan = document.createElement('span');
        countSpan.className = "flex justify-center items-center rounded w-5 h-5 bg-blue-700 relative"
        countSpan.textContent = `${submission.problems.length}` 
        
        div.appendChild(p);
        div.appendChild(countSpan);
        row.appendChild(div);
        container.appendChild(row);

    });
}
