"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/user/ui/input";
import { Separator } from "@/components/user/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/user/ui/card";
import { Button } from "@/components/user/ui/button";
import useUserStore from "@/app/auth/userStore";

interface MyProfileProps {
    onUserUpdate: (updatedFields: Partial<{ email: string; phone: string }>) => void;
  }

  export default function MyProfile({ onUserUpdate }: MyProfileProps) {
  const { user } = useUserStore();
  const API_URL = "/api/mypage";

  // 수정용 state
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPhone, setNewPhone] = useState(user?.phone || "");



  // 이메일 수정 버튼 클릭
  const handleEditEmailClick = () => {
      setNewEmail(user?.email || "");
      setIsEditingEmail(true);
  };

  // 휴대폰 수정 버튼 클릭
  const handleEditPhoneClick = () => {
      setNewPhone(user?.phone || "");
      setIsEditingPhone(true);
  };

  // 이메일 저장
  const handleEmailSave = async () => {
    try {
      const response = await fetch(`${API_URL}/update-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await response.json();
      if (data.totalCount === 1) {
        alert(data.msg || "이메일이 성공적으로 변경되었습니다.");
        setEmail(newEmail);
        setIsEditingEmail(false);
        onUserUpdate({ email: newEmail });
      } else {
        alert(data.msg || "이메일 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 저장 실패:", error);
      alert("이메일 변경 요청 중 오류가 발생했습니다.");
    }
  };

  // 연락처
  const handlePhoneSave = async () => {
    try {
      const response = await fetch(`${API_URL}/update-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: newPhone }),
      });
      const data = await response.json();
      if (data.totalCount === 1) {
        alert(data.msg || "연락처가 성공적으로 변경되었습니다.");
        setPhone(newPhone);
        setIsEditingPhone(false);
        onUserUpdate({ phone: newPhone });
      } else {
        alert(data.msg || "연락처 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("연락처 저장 실패:", error);
      alert("연락처 변경 요청 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 재설정 링크 발송
  const handlePasswordReset = async () => {
    try {
      const response = await fetch(`${API_URL}/send-reset-password-email`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.totalCount === 1) {
        alert(data.msg || "비밀번호 재설정 링크가 이메일로 전송되었습니다.");
      } else {
        alert(data.msg || "비밀번호 재설정 링크 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 재설정 요청 실패:", error);
      alert("비밀번호 재설정 요청 중 오류가 발생했습니다.");
    }
  };


  return (
    <>
      {/* ➡️ 내 프로필 */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg">내 프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400">이미지</div>
            <div className="col-span-1">
              <Image
                src={user?.profileUrl || "/placeholder.svg?height=80&width=80"}
                alt="프로필 이미지"
                width={80}
                height={80}
                className="rounded-full bg-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400">닉네임</div>
            <div className="col-span-1">{user?.nickname || "사용자"}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400">GitHub</div>
            <div className="col-span-1 text-sm">{user?.username || "user"}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400">자기소개</div>
            <div className="col-span-1 text-sm">{user?.bio || "자기소개를 작성해주세요."}</div>
          </div>

          <div className="text-right">
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              설정
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 기본 정보 */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 이메일 */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400">이메일</div>
            <div className="col-span-1">
              {isEditingEmail ? (
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="text-white"
                />
              ) : (
                email || "이메일을 등록해주세요."
              )}
            </div>
            <div className="text-right">
              {isEditingEmail ? (
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={handleEmailSave}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  저장
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditEmailClick}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  수정
                </Button>
              )}
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400">비밀번호</div>
            <div className="col-span-1">••••••••••</div>
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handlePasswordReset}
              >
                재설정
              </Button>
            </div>
          </div>

          {/* 연락처 */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400">연락처</div>
            <div className="col-span-1">
              {isEditingPhone ? (
                <Input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="text-white"
                />
              ) : (
                phone || "연락처를 등록해주세요."
              )}
            </div>
            <div className="text-right">
              {isEditingPhone ? (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handlePhoneSave}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  저장
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditPhoneClick}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  수정
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
