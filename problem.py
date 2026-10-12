# # que-1
# word="python"
# total=0
# for a in word:
#     if a=="a" or a=="e" or a=="i" or a=="o" or a=="u":
#         print(f"{a}==>2")
#         total+=2
#     else:
#         print(f"{a}=>1")
#         total+=1
# print(f"total score:{total}")

# # que=2
# temps=[28,31,29,29,33,30,35]
# for i in range(1,len(temps)):
#     if temps[i]>temps[i-1]:
#         print(f"day{i+1}:Increases by {temps[i]-temps[i-1]}")
#     elif temps[i]<temps[i-1]:
#         print(f"day{i+1}:Increases by {temps[i-1]-temps[i]}")
#     else:
#         print(f"day{i+1}:No chnges")
# # que-3
# boys=["Amit","Rahul","Kiran","Arjun"]
# girls=["priya","Neha","Sneha","Pooja"]
# ans=[]
# for i in range(len(boys)):
#     ans.append(boys[i])
#     ans.append(girls[i])
# print(ans)
# print(f"total names:{len(ans)}")
