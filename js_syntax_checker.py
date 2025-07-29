#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JavaScript 파일 구문 검사 도구
"""

import re
import json

def check_js_syntax(file_path):
    """JavaScript 파일의 기본적인 구문 검사"""
    
    print(f"📁 파일 분석: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ 파일 읽기 실패: {e}")
        return False
    
    print(f"📊 파일 크기: {len(content)} 문자")
    
    # 1. 기본 괄호 검사
    print("\n🔍 괄호 균형 검사...")
    if not check_brackets(content):
        return False
    
    # 2. 클래스 정의 검사
    print("\n🔍 클래스 정의 검사...")
    if not check_class_definition(content):
        return False
    
    # 3. 문자열 검사
    print("\n🔍 문자열 균형 검사...")
    if not check_string_balance(content):
        return False
    
    # 4. 주요 구문 요소 검사
    print("\n🔍 주요 구문 요소 검사...")
    check_syntax_elements(content)
    
    print("\n✅ 기본 구문 검사 완료!")
    return True

def check_brackets(content):
    """괄호 균형 검사"""
    stack = []
    brackets = {'{': '}', '[': ']', '(': ')'}
    
    # 문자열과 주석 제거
    cleaned_content = remove_strings_and_comments(content)
    
    for i, char in enumerate(cleaned_content):
        if char in brackets:
            stack.append((char, i))
        elif char in brackets.values():
            if not stack:
                print(f"❌ 닫는 괄호 '{char}'에 대응하는 여는 괄호가 없습니다 (위치: {i})")
                return False
            
            open_bracket, _ = stack.pop()
            if brackets[open_bracket] != char:
                print(f"❌ 괄호 불일치: '{open_bracket}' vs '{char}' (위치: {i})")
                return False
    
    if stack:
        open_bracket, pos = stack[0]
        print(f"❌ 닫히지 않은 괄호 '{open_bracket}' (위치: {pos})")
        return False
    
    print("✅ 괄호 균형 정상")
    return True

def check_class_definition(content):
    """클래스 정의 검사"""
    class_pattern = r'class\s+(\w+)\s*\{'
    matches = re.finditer(class_pattern, content)
    
    classes = []
    for match in matches:
        class_name = match.group(1)
        classes.append(class_name)
        print(f"📋 클래스 발견: {class_name} (위치: {match.start()})")
    
    if not classes:
        print("❌ 클래스 정의를 찾을 수 없습니다")
        return False
    
    # SurveyDataManager 클래스 확인
    if 'SurveyDataManager' not in classes:
        print("❌ SurveyDataManager 클래스가 없습니다")
        return False
    
    print("✅ 클래스 정의 정상")
    return True

def check_string_balance(content):
    """문자열 따옴표 균형 검사"""
    in_single = False
    in_double = False
    in_template = False
    escaped = False
    
    for i, char in enumerate(content):
        if escaped:
            escaped = False
            continue
            
        if char == '\\':
            escaped = True
            continue
            
        if char == "'" and not in_double and not in_template:
            in_single = not in_single
        elif char == '"' and not in_single and not in_template:
            in_double = not in_double
        elif char == '`' and not in_single and not in_double:
            in_template = not in_template
    
    if in_single:
        print("❌ 닫히지 않은 단일 따옴표 문자열")
        return False
    if in_double:
        print("❌ 닫히지 않은 이중 따옴표 문자열")
        return False
    if in_template:
        print("❌ 닫히지 않은 템플릿 리터럴")
        return False
    
    print("✅ 문자열 따옴표 균형 정상")
    return True

def remove_strings_and_comments(content):
    """문자열과 주석을 제거하여 구문 분석용 코드만 남김"""
    result = []
    i = 0
    while i < len(content):
        # 단일 행 주석
        if i < len(content) - 1 and content[i:i+2] == '//':
            while i < len(content) and content[i] != '\n':
                i += 1
            continue
        
        # 다중 행 주석
        if i < len(content) - 1 and content[i:i+2] == '/*':
            i += 2
            while i < len(content) - 1:
                if content[i:i+2] == '*/':
                    i += 2
                    break
                i += 1
            continue
        
        # 문자열 (간단한 처리)
        if content[i] in ['"', "'", '`']:
            quote = content[i]
            i += 1
            while i < len(content):
                if content[i] == quote and (i == 0 or content[i-1] != '\\'):
                    i += 1
                    break
                i += 1
            continue
        
        result.append(content[i])
        i += 1
    
    return ''.join(result)

def check_syntax_elements(content):
    """주요 구문 요소들 검사"""
    
    # 함수 정의 검사
    function_pattern = r'(?:function\s+\w+|(?:async\s+)?(?:static\s+)?\w+\s*\()'
    functions = re.findall(function_pattern, content)
    print(f"📋 함수 패턴 {len(functions)}개 발견")
    
    # getInstance 메서드 검사
    if 'getInstance' in content:
        print("✅ getInstance 메서드 발견")
    else:
        print("⚠️  getInstance 메서드를 찾을 수 없습니다")
    
    # 생성자 검사
    if 'constructor(' in content:
        print("✅ constructor 메서드 발견")
    else:
        print("⚠️  constructor 메서드를 찾을 수 없습니다")
    
    # 전역 노출 검사
    if 'window.surveyDataManager' in content:
        print("✅ window.surveyDataManager 노출 코드 발견")
    else:
        print("⚠️  window.surveyDataManager 노출 코드를 찾을 수 없습니다")

def find_potential_issues(content):
    """잠재적인 문제점 찾기"""
    print("\n🔍 잠재적 문제점 검사...")
    
    issues = []
    
    # 세미콜론 누락 검사 (간단한 패턴)
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped and not stripped.endswith((';', '{', '}', '//', '/*', '*/', ',')):
            if not stripped.startswith(('*', '//', '/*', 'class', 'function', 'if', 'for', 'while', 'try', 'catch')):
                issues.append(f"라인 {i}: 세미콜론 누락 가능성 - {stripped[:50]}")
    
    if issues:
        print("⚠️  잠재적 문제점들:")
        for issue in issues[:10]:  # 처음 10개만 표시
            print(f"  {issue}")
        if len(issues) > 10:
            print(f"  ... 및 {len(issues) - 10}개 더")
    else:
        print("✅ 명백한 문제점이 발견되지 않았습니다")

if __name__ == "__main__":
    file_path = "survey-data-manager.js"
    
    print("🔍 JavaScript 파일 구문 검사 시작")
    print("=" * 50)
    
    try:
        success = check_js_syntax(file_path)
        
        if success:
            # 추가 분석
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            find_potential_issues(content)
            
            print("\n" + "=" * 50)
            print("🎉 검사 완료! 주요 구문 오류는 발견되지 않았습니다.")
        else:
            print("\n" + "=" * 50)
            print("❌ 구문 오류가 발견되었습니다. 위의 메시지를 확인하세요.")
    
    except Exception as e:
        print(f"\n❌ 검사 중 오류 발생: {e}")
