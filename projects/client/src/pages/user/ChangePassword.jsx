import React from "react";

function ChangePassword() {
    return (
        <>

            <hr className="w-48 h-1 mx-auto my-4 bg-gray-900 border-0 rounded" />
            <div className="flex justify-center py-6">
                <p className="font-bold">* If You Change Your Password, You Will Need To Re-Login</p>
            </div>
            <div className="flex justify-center">
                <div className="flex md:items-center mb-6">
                    <div className="w-full">
                        <TextInput type={"password"} label={"Password"} placeholder={'Old Password'} value={''} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex md:items-center mb-6">
                    <div className="w-full">
                        <TextInput type={"password"} label={"New Password"} placeholder={'New Password'} value={''} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex md:items-center mb-6">
                    <div className="w-full">
                        <TextInput type={"password"} label={"Confirm New Password"} placeholder={'Confirm New Password'} value={''} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="p-4">
                    <Button label={'Change Password'}></Button>
                </div>
            </div>

        </>
    )
}

export default ChangePassword