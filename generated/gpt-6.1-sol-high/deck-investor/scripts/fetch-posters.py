"""Download still fallbacks from the exact provided Mux videos; no page imagery."""
import subprocess
ids=['Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g','s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200','Gs3wZfrtz6ZfqZqQ02c02Z7lugV00FGZvRpcqFTel66r3g','PkFsoKeakRLgL01gjf02CRcSbsJ600Z00NvLr9eRZ92pLbA','BuGGTsiXq1T00WUb8qfURrHkTCbhrkfFLSv4uAOZzdhw']
for i,id in enumerate(ids,1):
 try:
  subprocess.run(['curl','-fLsS','--max-time','25',f'https://image.mux.com/{id}/thumbnail.jpg?time=1&width=1920','-o',f'public/posters/slide-{i}.jpg'],check=True)
  print(f'Slide {i}: poster saved')
 except Exception as e:print(f'Slide {i}: {e}')
