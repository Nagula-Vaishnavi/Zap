import requests
import json

data = {
    'projectDescription': 'Test project',
    'projectCode': 'print("hello")',
    'department': 'Computer Science',
    'mainProfessor': 'Dr. Smith',
    'mainProfessor_designation': 'Professor',
    'professorDepartment': 'Computer Science & Engineering',
    'secondaryProfessor': '',
    'secondaryProfessor_designation': '',
    'course': 'Python Programming',
    'teamMembers': [{'name': 'John Doe', 'rollNumber': '123', 'gender': 'Male'}],
    'result': {'resultImages': [], 'codeOutput': 'hello', 'aiGeneratedContent': False}
}

try:
    response = requests.post('http://localhost:8000/api/generate-report', json=data, timeout=60)
    print(f'Status: {response.status_code}')
    print(f'Response: {response.text[:1000]}')
except Exception as e:
    print(f'Error: {e}')
